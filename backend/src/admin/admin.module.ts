import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { OrdersModule } from '../orders/orders.module';
import { AdminAuthGuard } from './admin.guard';

@Module({
  imports: [OrdersModule],
  controllers: [AdminController],
  providers: [AdminAuthGuard],
})
export class AdminModule {}
