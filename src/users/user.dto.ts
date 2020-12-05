import { IsOptional, IsString, ValidateNested } from 'class-validator';
import CreateAddressDto from './address.dto';

class CreateUserDto {
  // @IsString()
  // public _id: string;

  @IsString()
  public name: string;

  @IsString()
  public email: string;

  @IsString()
  public password: string;

  // @IsOptional()
  // @ValidateNested()
  // public address?: CreateAddressDto;
}

export default CreateUserDto;