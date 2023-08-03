import { Logger, Injectable } from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { Expansions } from './model/expansion.schema';

@Injectable()
export class ExpansionService {
    private readonly logger: Logger = new Logger(ExpansionService.name);
    constructor(
        @InjectRepository(Expansions)
        private expansions: BaseFirestoreRepository<Expansions>
    ) {}

    async findOne(id: string): Promise<Expansions> {
        try {
            return await this.expansions.findById(id);
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }

    async findAll(): Promise<Array<Expansions>> {
        try {
            return await this.expansions.find();
        } catch (err) {
            this.logger.error(err);
            return [];
        }
    }

    async insertOrUpdate(expansions: Expansions): Promise<Expansions> {
        try {
            let existing = (await this.findAll())[0];
            if (existing)
            {
                expansions.id = existing.id;
                await this.expansions.update(expansions);
            }else {
                expansions = await this.expansions.create(expansions);
            }
            return expansions;
        } catch (err) {
            this.logger.error(err);
            return null;
        }
    }
}