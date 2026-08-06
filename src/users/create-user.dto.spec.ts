import { validate } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { before } from 'node:test';

describe('CreateUserDto', () => {
  let dto: CreateUserDto;

  beforeEach(() => {
    dto = new CreateUserDto();
    dto.name = 'John Doe';
    dto.email = 'john.doe@example.com';
    dto.password = 'AB#@securepassword1';
  });

  it('should be defined', () => {
    expect(new CreateUserDto()).toBeDefined();
  });

  it('should validate complete valid data', async () => {
    const errors = await validate(dto);
    console.log(errors);
    expect(errors.length).toBe(0);
  });

  it('should fail on invalid email', async () => {
    dto.email = 'invalid-email';
    const errors = await validate(dto);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('email');
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  const testPassword = async (password: string, message: string) => {
    dto.password = password;
    const errors = await validate(dto);
    const passwordError = errors.find((error) => error.property === 'password');
    expect(passwordError).not.toBeUndefined();
    const messages = Object.values(passwordError?.constraints ?? {});
    expect(messages).toContain(message);
  };

  it('should fail for at least 1 Uppercase letter', async () => {
    await testPassword(
      'abcdefghijk',
      'Password must contain at least 1 uppercase letter',
    );
  });

  it('should fail for at least 1 number', async () => {
    await testPassword(
      'abcdefghijkA',
      'Password must contain at least 1 number',
    );
  });

  it('should fail for at least 1 special character', async () => {
    await testPassword(
      'abcdefghijkA1',
      'Password must contain at least 1 special character',
    );
  });
});
