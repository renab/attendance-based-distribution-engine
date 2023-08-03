import { Controller, Get, Post, Put, UseGuards, Param, Body, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Expansion, Expansions } from './model/expansion.schema';
import { ExpansionService } from './expansion.service';
import { FirebaseAuthGuard } from '../authentication/auth.guard';
import { Claims } from '../authentication/claims.decorator';

@Controller('/api/expansions')
export class ExpansionController {
    private readonly logger: Logger = new Logger(ExpansionController.name);
    constructor(private readonly expansionService: ExpansionService) {}

    @Get('')
    async getAll() {
        const expansions = await this.expansionService.findAll();
        return expansions[0].expansions;
    }

    @Post('')
    @Claims('Admin')
    @UseGuards(FirebaseAuthGuard)
    async createExpansion(@Body() expansions: Expansions) {
        return await this.expansionService.insertOrUpdate(expansions);
    }

    @Put(':id')
    @Claims('Admin')
    @UseGuards(FirebaseAuthGuard)
    async updateExpansion(@Param('id') id: string, @Body() expansions: Array<Expansion>) {
        if (!id)
        {
            throw new HttpException('The ID of the expansion you wish to modify must be specified.', HttpStatus.NOT_ACCEPTABLE);            
        }
        const updatedExpansions = await this.expansionService.insertOrUpdate({ id: `${id}`, expansions: expansions});
        return updatedExpansions.expansions;
    }
}