import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { OrdersService } from '../orders/orders.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-status.dto';
import { AdminAuthGuard } from './admin.guard';

@Controller('api/admin')
@UseGuards(AdminAuthGuard)
export class AdminController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('orders')
  async getAllOrders() {
    return this.ordersService.findAll();
  }

  @Patch('orders/:id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateStatus(id, updateDto.status);
  }
}
