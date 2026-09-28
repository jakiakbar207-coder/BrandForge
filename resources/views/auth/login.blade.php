<x-guest-layout>
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />
        
        @if(isset($role))
        <h2 class="text-2xl font-bold text-center mb-4">
            Login {{ ucfirst($role) }}
        </h2>
    @endif

    <form method="POST" action="{{ route('login') }}">
        @csrf

        @if(isset($role))
            <input type="hidden" name="role" value="{{ $role }}">
        @endif

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('Password')" />

            <x-text-input id="password" class="block mt-1 w-full"
                            type="password"
                            name="password"
                            required autocomplete="current-password" />

            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        {{-- Nama --}}
<div class="mt-4">
    <x-input-label for="name" value="Nama Lengkap" />

    <x-text-input
        id="name"
        class="block mt-1 w-full"
        type="text"
        name="name"
        :value="old('name')"
        required
    />

    <x-input-error :messages="$errors->get('name')" class="mt-2" />
</div>

{{-- Alamat --}}
<div class="mt-4">
    <x-input-label for="alamat" value="Alamat" />

    <textarea
        id="alamat"
        name="alamat"
        class="block mt-1 w-full border-gray-300 rounded-md"
        rows="3"
        required>{{ old('alamat') }}</textarea>

    <x-input-error :messages="$errors->get('alamat')" class="mt-2" />
</div>

{{-- No Telepon --}}
<div class="mt-4">
    <x-input-label for="no_hp" value="No. Telepon" />

    <x-text-input
        id="no_hp"
        class="block mt-1 w-full"
        type="text"
        name="no_hp"
        :value="old('no_hp')"
        placeholder="08xxxxxxxxxx"
        required
    />

    <x-input-error :messages="$errors->get('no_hp')" class="mt-2" />
</div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" name="remember">
                <span class="ms-2 text-sm text-gray-600">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-end mt-4">
            @if (Route::has('password.request'))
                <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                    {{ __('Forgot your password?') }}
                </a>
            @endif

            <x-primary-button class="ms-3">
                {{ __('Log in') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
