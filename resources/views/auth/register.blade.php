<x-guest-layout>

    <form method="POST" action="{{ route('register') }}">
        @csrf

        <!-- Nama -->
        <div>
            <x-input-label for="name" :value="__('Nama Lengkap')" />

            <x-text-input
                id="name"
                class="block mt-1 w-full"
                type="text"
                name="name"
                :value="old('name')"
                required
                autofocus
                autocomplete="name"
            />

            <x-input-error
                :messages="$errors->get('name')"
                class="mt-2"
            />
        </div>

        <!-- Email -->
        <div class="mt-4">
            <x-input-label for="email" :value="__('Email')" />

            <x-text-input
                id="email"
                class="block mt-1 w-full"
                type="email"
                name="email"
                :value="old('email')"
                required
                autocomplete="username"
            />

            <x-input-error
                :messages="$errors->get('email')"
                class="mt-2"
            />
        </div>

        <!-- No Telepon -->
        <div class="mt-4">
            <x-input-label
                for="no_telepon"
                :value="__('No. Telepon')"
            />

            <x-text-input
                id="no_telepon"
                class="block mt-1 w-full"
                type="text"
                name="no_telepon"
                :value="old('no_telepon')"
                required
                autocomplete="tel"
                placeholder="Contoh: 081234567890"
            />

            <x-input-error
                :messages="$errors->get('no_telepon')"
                class="mt-2"
            />
        </div>

        <!-- Alamat -->
        <div class="mt-4">
            <x-input-label
                for="alamat"
                :value="__('Alamat Lengkap')"
            />

            <textarea
                id="alamat"
                name="alamat"
                rows="4"
                class="block mt-1 w-full border-gray-300
                       focus:border-indigo-500 focus:ring-indigo-500
                       rounded-md shadow-sm"
                required
                autocomplete="street-address"
                placeholder="Masukkan alamat lengkap untuk pengiriman"
            >{{ old('alamat') }}</textarea>

            <x-input-error
                :messages="$errors->get('alamat')"
                class="mt-2"
            />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label
                for="password"
                :value="__('Password')"
            />

            <x-text-input
                id="password"
                class="block mt-1 w-full"
                type="password"
                name="password"
                required
                autocomplete="new-password"
            />

            <x-input-error
                :messages="$errors->get('password')"
                class="mt-2"
            />
        </div>

        <!-- Konfirmasi Password -->
        <div class="mt-4">
            <x-input-label
                for="password_confirmation"
                :value="__('Konfirmasi Password')"
            />

            <x-text-input
                id="password_confirmation"
                class="block mt-1 w-full"
                type="password"
                name="password_confirmation"
                required
                autocomplete="new-password"
            />

            <x-input-error
                :messages="$errors->get('password_confirmation')"
                class="mt-2"
            />
        </div>

        <div class="flex items-center justify-end mt-4">

            <a
                class="underline text-sm text-gray-600
                       hover:text-gray-900 rounded-md
                       focus:outline-none focus:ring-2
                       focus:ring-offset-2 focus:ring-indigo-500"
                href="{{ route('login') }}"
            >
                {{ __('Sudah punya akun? Login') }}
            </a>

            <x-primary-button class="ms-4">
                {{ __('Daftar') }}
            </x-primary-button>

        </div>

    </form>

</x-guest-layout>