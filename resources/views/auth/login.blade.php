<x-guest-layout>
    <div class="mb-8 text-center">
        <h2 class="text-4xl font-bold text-pink-700">خوش آمدی! 👋</h2>
        <p class="text-2xl mt-2 text-gray-600">برای ادامه وارد حسابت شو 😏</p>
    </div>
 <link rel="icon" href="{{ asset('images/icons8-love-book-48.png') }}" type="image/png">
    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('ایمیل')" class="text-pink-700" />
            <x-text-input id="email" class="block mt-1 w-full rounded-xl border-pink-300 focus:border-pink-500 focus:ring-pink-500" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('رمز عبور')" class="text-pink-700" />
            <x-text-input id="password" class="block mt-1 w-full rounded-xl border-pink-300 focus:border-pink-500 focus:ring-pink-500" type="password" name="password" required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-pink-600 shadow-sm focus:ring-pink-500" name="remember">
                <span class="mr-2 text-sm text-gray-600">{{ __('یادم بیار برای دفعه بعد') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-between mt-8">
            <!-- ثبت‌نام لینک -->
            <div>
                <span class="text-sm text-gray-600">هنوز حساب نساختی؟</span>
                <a href="{{ route('register') }}" class="font-bold text-pink-600 hover:text-pink-500 mr-1">
                    همین الان ثبت‌ نام کنید
                </a>
            </div>

            <!-- ورود و فراموشی رمز -->
            <div class="flex items-center gap-4">
                @if (Route::has('password.request'))
                    <a class="underline text-sm text-sky-600 hover:text-sky-500" href="{{ route('password.request') }}">
                        {{ __('آیا شما هم مثل یک ماهی رمز خود را فراموش میکنید؟') }}
                    </a>
                @endif

                <x-primary-button class="bg-pink-500 hover:bg-pink-600 px-6">
                    {{ __('ورود') }}
                </x-primary-button>
            </div>
        </div>
    </form>
</x-guest-layout>