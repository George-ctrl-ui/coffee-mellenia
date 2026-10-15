import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Injectable()
export class ContactService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    const record = await this.prisma.contactMessage.create({
      data: {
        name: createContactDto.name.trim(),
        email: createContactDto.email.trim(),
        subject: createContactDto.subject.trim(),
        message: createContactDto.message.trim(),
      },
    });

    return {
      success: true,
      message: 'Thank you for reaching out to Coffee Mellenia. Our team will get back to you shortly.',
      id: record.id,
    };
  }

  async findAll() {
    return this.prisma.contactMessage.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
