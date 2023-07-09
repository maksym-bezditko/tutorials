import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { NotFoundException } from '@nestjs/common';
import {
  TOP_PAGE_NOT_FOUND_ADVICE,
  TOP_PAGE_NOT_FOUND_ERROR,
} from './top-page.constants';
import { FindTopPageDto } from './dto/find-top-page.dto';

@Injectable()
export class TopPageService {
  constructor(
    @InjectModel(TopPageModel)
    private readonly topPageModel: ModelType<TopPageModel>,
  ) {}

  async create(dto: CreateTopPageDto) {
    return this.topPageModel.create(dto);
  }

  async findByCheckedId(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async checkForExistenseAndThrowError(id: string) {
    const topPage = await this.topPageModel.findById(id).exec();

    if (!topPage) {
      throw new NotFoundException(
        TOP_PAGE_NOT_FOUND_ERROR,
        TOP_PAGE_NOT_FOUND_ADVICE,
      );
    }
  }

  async validateAndFindById(id: string) {
    await this.checkForExistenseAndThrowError(id);

    return this.findByCheckedId(id);
  }

  async deleteById(id: string) {
    await this.checkForExistenseAndThrowError(id);

    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    await this.checkForExistenseAndThrowError(id);

    return this.topPageModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async findByFirstCategory({ firstCategory }: FindTopPageDto) {
    return this.topPageModel
      .find({ firstCategory }, { alias: 1, secondCategory: 1, title: 1 })
      .exec();
  }

  async findByAlias(alias: string) {
    return this.topPageModel.findOne({ alias }).exec();
  }
}
