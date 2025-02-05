import { Asset } from 'src/entities/catalogs/assets/asset.entity';
import { Location } from 'src/entities/catalogs/locations/location.entity';
import { Responsible } from 'src/entities/catalogs/responsibles/responsible.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';

@Entity()
export class InventoryRecord {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Location, { eager: true })
  location: Location;

  @ManyToOne(() => Asset, { eager: true })
  asset: Asset;

  @ManyToOne(() => Responsible, { eager: true })
  responsible: Responsible;

  @Column({ type: 'varchar', length: 255, nullable: true })
  serialNumber: string | null;

  @Column({ type: 'text', nullable: true })
  description: string | null;
}
