import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    shop: {
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return token on successful login', async () => {
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('test123456', 12);

    mockPrismaService.user.findUnique.mockResolvedValue({
      id: '1',
      email: 'test@test.com',
      passwordHash: hashedPassword,
      firstName: 'Test',
      lastName: 'User',
      shopId: 'shop-1',
    });

    const result = await service.login({ email: 'test@test.com', password: 'test123456' });
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('user');
  });
});
