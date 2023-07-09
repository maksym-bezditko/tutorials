import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { TopPageModel } from './top-page.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { NotFoundException } from '@nestjs/common';
import {
  TOP_PAGE_ALIAS_FOUND_ADVICE,
  TOP_PAGE_ALIAS_FOUND_ERROR,
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

  async checkForExistenseByIdAndThrowError(id: string, throwWhenFound = false) {
    const topPage = await this.topPageModel.findById(id).exec();

    const shouldThrowAnError = throwWhenFound ? topPage : !topPage;

    if (shouldThrowAnError) {
      throw new NotFoundException(
        TOP_PAGE_NOT_FOUND_ERROR,
        TOP_PAGE_NOT_FOUND_ADVICE,
      );
    }
  }

  async checkForExistenseByAliasAndThrowError(
    alias: string,
    throwWhenFound = false,
  ) {
    const topPage = await this.topPageModel.findOne({ alias }).exec();

    const shouldThrowAnError = throwWhenFound ? topPage : !topPage;

    if (shouldThrowAnError) {
      throw new BadRequestException(
        TOP_PAGE_ALIAS_FOUND_ERROR,
        TOP_PAGE_ALIAS_FOUND_ADVICE,
      );
    }
  }

  async create(dto: CreateTopPageDto) {
    await this.checkForExistenseByAliasAndThrowError(dto.alias, true);

    return this.topPageModel.create(dto);
  }

  async findByExistingId(id: string) {
    return this.topPageModel.findById(id).exec();
  }

  async validateAndFindById(id: string) {
    await this.checkForExistenseByIdAndThrowError(id);

    return this.findByExistingId(id);
  }

  async deleteById(id: string) {
    await this.checkForExistenseByIdAndThrowError(id);

    return this.topPageModel.findByIdAndDelete(id).exec();
  }

  async updateById(id: string, dto: CreateTopPageDto) {
    await this.checkForExistenseByIdAndThrowError(id);

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

  async findByText(searchText: string) {
    return this.topPageModel.find({
      $text: {
        $search: searchText,
        $caseSensitive: false,
      },
    });
  }
}
