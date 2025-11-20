<button {{ $attributes->merge(['type' => 'submit', 'class' => 'inline-flex items-center justify-center w-full px-20 py-4 bg-pink-500 border border-transparent rounded-md font-semibold text-2xl text-white  uppercase tracking-widest hover:bg-gray-700  focus:bg-gray-700 dark:focus:bg-white active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2  transition ease-in-out duration-150']) }}>
    {{ $slot }}
</button>
