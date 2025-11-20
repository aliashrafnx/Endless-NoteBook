@props(['disabled' => false])

<input 
    @disabled($disabled) 
    {{ $attributes->merge([
        'class' => 'border border-gray-400 shadow-lg rounded-md 
                    focus:border-pink-500 focus:ring-0 focus:shadow-sm 
                    transition-all duration-300'
    ]) }}
>