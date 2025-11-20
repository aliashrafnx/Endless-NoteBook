<x-guest-layout>
 <link rel="icon" href="{{ asset('images/icons8-love-book-48.png') }}" type="image/png">

    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('password.email') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('ایمیل')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <div class="flex items-center justify-end mt-4">
            <x-primary-button>
                {{ __('ایمیل کنم یه رمز دیگه رو؟') }}
            </x-primary-button>
        </div>
    </form>
</x-guest-layout>
