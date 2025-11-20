@props(['value'])

<label {{ $attributes->merge(['class' => ' block font-bold text-bg text-pink-700']) }}>
    {{ $value ?? $slot }}
</label>
