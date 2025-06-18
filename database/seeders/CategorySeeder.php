<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Home Services',
                'subcategories' => [
                    'House Cleaning',
                    'Plumbing',
                    'Electrical Work'
                ]
            ],
            [
                'name' => 'Beauty & Wellness',
                'subcategories' => [
                    'Hair Styling',
                    'Massage',
                    'Nail Care'
                ]
            ],
            [
                'name' => 'Education & Training',
                'subcategories' => [
                    'Academic Tutoring',
                    'Language Classes',
                    'Music Lessons'
                ]
            ],
            [
                'name' => 'Auto Services',
                'subcategories' => [
                    'Car Repair',
                    'Car Wash',
                    'Oil Change'
                ]
            ],
            [
                'name' => 'Tech Support',
                'subcategories' => [
                    'Computer Repair',
                    'Phone Repair',
                    'Network Setup'
                ]
            ]
        ];

        foreach ($categories as $category) {
            $mainCategory = \App\Models\Category::create([
                'name' => $category['name'],
                'parent_id' => null
            ]);

            foreach ($category['subcategories'] as $subcategory) {
                \App\Models\Category::create([
                    'name' => $subcategory,
                    'parent_id' => $mainCategory->id
                ]);
            }
        }
    }
}
