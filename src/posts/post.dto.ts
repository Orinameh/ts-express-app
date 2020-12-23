import { IsString, IsOptional } from 'class-validator';
 
class CreatePostDto {
  @IsOptional()
  @IsString()
  public author: string;
 
  @IsString()
  public content: string;
 
  @IsString()
  public title: string;
}
 
export default CreatePostDto;