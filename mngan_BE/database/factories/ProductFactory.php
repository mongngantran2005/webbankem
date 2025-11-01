<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $name = $this->faker->words(3, true);

        return [
            'category_id' => $this->faker->numberBetween(1, 5),
            'brand_id' => $this->faker->numberBetween(1, 5),
            'name' => $name,
            'slug' => Str::slug($name),
            'price_root' => $this->faker->numberBetween(10000, 500000),
            'price_sale' => $this->faker->numberBetween(5000, 400000),
            'thumbnail' => $this->faker->imageUrl(640, 480, 'products', true),
            'qty' => $this->faker->numberBetween(1, 200),
            'detail' => $this->faker->sentence(6),
            'description' => $this->faker->paragraph(2),
            'created_by' => 1,
            'updated_by' => null,
            'status' => 1,
        ];
    }
}
