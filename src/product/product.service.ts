import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ProductModel } from './product.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { CreateProductDto } from './dto/create-product.dto';
import {
  PRODUCT_NOT_FOUND_ADVICE,
  PRODUCT_NOT_FOUND_ERROR,
} from './product.constants';
import { FindProductDto } from './dto/find-product.dto';
import { ReviewModel } from 'src/review/review.model';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(ProductModel)
    private readonly productModel: ModelType<ProductModel>,
  ) {}

  async create(dto: CreateProductDto) {
    return this.productModel.create(dto);
  }

  async findById(id: string) {
    const product = await this.productModel.findById(id).exec();

    if (!product) {
      throw new NotFoundException(
        PRODUCT_NOT_FOUND_ERROR,
        PRODUCT_NOT_FOUND_ADVICE,
      );
    }

    return product;
  }

  async deleteById(id: string) {
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new NotFoundException(
        PRODUCT_NOT_FOUND_ERROR,
        PRODUCT_NOT_FOUND_ADVICE,
      );
    }
  }

  async updateById(id: string, dto: CreateProductDto) {
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (!updatedProduct) {
      throw new NotFoundException(
        PRODUCT_NOT_FOUND_ERROR,
        PRODUCT_NOT_FOUND_ADVICE,
      );
    }

    return updatedProduct;
  }

  async findWithReviews(dto: FindProductDto) {
    return this.productModel
      .aggregate([
        {
          $match: {
            categories: dto.category,
          },
        },
        {
          $sort: {
            _id: 1,
          },
        },
        {
          $limit: dto.limit,
        },
        {
          $lookup: {
            from: 'Review',
            localField: '_id',
            foreignField: 'productId',
            as: 'reviews',
          },
        },
        {
          $addFields: {
            reviewsCount: {
              $size: '$reviews',
            },
            reviewsAvg: {
              $avg: '$reviews.rating',
            },
            reviews: {
              $function: {
                body: `function (reviews) {
                  reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                  return reviews;
                }`,
                args: ['$reviews'],
                lang: 'js',
              },
            },
          },
        },
      ])
      .exec() as Promise<
      (ProductModel & {
        reviews: ReviewModel[];
        reviewCount: number;
        reviewAvg: number;
      })[]
    >;
  }
}
