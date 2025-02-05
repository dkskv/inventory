import { Field, Int, ObjectType, registerEnumType } from '@nestjs/graphql';
import { AccessRole, Privilege } from './access-control.const';

registerEnumType(AccessRole, { name: 'AccessRole' });
registerEnumType(Privilege, { name: 'Privilege' });

@ObjectType()
export class PrivilegeAccessDto {
  @Field(() => Privilege)
  name: Privilege;

  @Field(() => Int)
  permissions: number;
}
