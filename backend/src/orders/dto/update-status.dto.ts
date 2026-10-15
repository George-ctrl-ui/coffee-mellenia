import { IsEnum, IsNotEmpty } from 'class-validator';

export enum OrderStatusEnum {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  PREPARING = 'Preparing',
  READY_FOR_PICKUP = 'Ready for Pickup',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatusEnum, {
    message: 'status must be a valid OrderStatus (Pending, Confirmed, Preparing, Ready for Pickup, Completed, Cancelled)',
  })
  status!: OrderStatusEnum;
}
