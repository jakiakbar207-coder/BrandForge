<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Arbiansyah Akbar',
            'email' => 'owner@brandforge.com',
            'password' => Hash::make('12345678'),
            'role' => 'owner',
        ]);

        User::create([
            'name' => 'Admin BrandForge',
            'email' => 'admin@brandforge.com',
            'password' => Hash::make('12345678'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'Kasir BrandForge',
            'email' => 'kasir@brandforge.com',
            'password' => Hash::make('12345678'),
            'role' => 'kasir',
        ]);

        User::create([
            'name' => 'Pelanggan',
            'email' => 'pelanggan@brandforge.com',
            'password' => Hash::make('12345678'),
            'role' => 'pelanggan',
        ]);
    }
}