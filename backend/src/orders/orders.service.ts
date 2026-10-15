import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderStatusEnum } from './dto/update-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createOrderDto: CreateOrderDto) {
    const { customerName, customerPhone, customerEmail, notes, items } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order items cannot be empty.');
    }

    // Verify all products in database and recalculate prices
    const productIds = items.map((i) => i.productId);
    const dbProducts = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = new Map(dbProducts.map((p) => [p.id, p]));

    let calculatedTotal = 0;
    const itemsToCreate: {
      productId: string;
      productName: string;
      quantity: number;
      unitPrice: number;
      subtotal: number;
    }[] = [];

    for (const item of items) {
      const product = productMap.get(item.productId);
      if (!product) {
        throw new BadRequestException(`Product with ID "${item.productId}" does not exist.`);
      }
      if (!product.available) {
        throw new BadRequestException(`Product "${product.name}" is currently unavailable.`);
      }

      const subtotal = product.price * item.quantity;
      calculatedTotal += subtotal;

      itemsToCreate.push({
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: product.price,
        subtotal,
      });
    }

    // Generate unique reference (e.g., CM-849201)
    const refNumber = Math.floor(100000 + Math.random() * 900000).toString();
    const reference = `CM-${refNumber}`;

    // Execute atomic transaction
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          reference,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          customerEmail: customerEmail ? customerEmail.trim() : null,
          notes: notes ? notes.trim() : null,
          status: 'PENDING',
          total: calculatedTotal,
          items: {
            create: itemsToCreate,
          },
        },
        include: {
          items: true,
        },
      });

      return order;
    });
  }

  async findByReference(reference: string) {
    const order = await this.prisma.order.findUnique({
      where: { reference: reference.toUpperCase().trim() },
      include: { items: true },
    });

    if (!order) {
      throw new NotFoundException(`Order with reference "${reference}" not found.`);
    }

    return order;
  }

  async findAll() {
    return this.prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatusEnum) {
    const statusMap: Record<OrderStatusEnum, any> = {
      [OrderStatusEnum.PENDING]: 'PENDING',
      [OrderStatusEnum.CONFIRMED]: 'CONFIRMED',
      [OrderStatusEnum.PREPARING]: 'PREPARING',
      [OrderStatusEnum.READY_FOR_PICKUP]: 'READY_FOR_PICKUP',
      [OrderStatusEnum.COMPLETED]: 'COMPLETED',
      [OrderStatusEnum.CANCELLED]: 'CANCELLED',
    };

    const targetStatus = statusMap[status];

    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID "${id}" was not found.`);
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: targetStatus },
      include: { items: true },
    });
  }
}
