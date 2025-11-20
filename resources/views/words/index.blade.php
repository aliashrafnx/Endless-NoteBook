<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>دفترچه بی نهایت</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    <link href="https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Vazirmatn', sans-serif; background: linear-gradient(135deg, #fdf2f8 0%, #dbeafe 100%); min-height: 100vh; }
        .card { transition: all 0.3s; }
        .card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(236, 72, 153, 0.2); }
    </style>
     <link rel="icon" href="{{ asset('images/icons8-love-book-48.png') }}" type="image/png">

</head>
<body class="pb-20">

<x-app-layout>
    <div class="max-w-5xl mx-auto p-6">

        <!-- فرم اضافه کردن کلمه (فقط فارسی!) -->
        <div class="text-center my-12">
            <h1 class="text-4xl font-bold text-pink-700 mb-8">هر کلمه ای میخوای وارد کن خوشگله 😏</h1>
            
            <form action="{{ route('words.store') }}" method="POST" class="max-w-xl mx-auto">
                @csrf
                <div class="flex gap-3 shadow-2xl rounded-2xl overflow-hidden">
                    <input 
                        type="text" 
                        name="persian" 
                        required 
                        placeholder="یک کلمه فارسی بنویس..." 
                        class="flex-1 px-8 py-5 text-lg text-right border-0 focus:ring-0 focus:outline-none"
                        autofocus
                    >
                    <button class="bg-gradient-to-l from-pink-500 to-sky-400 text-white px-10 font-bold text-xl hover:from-pink-600 hover:to-sky-500 transition">
                         اضافه کن
                    </button>
                </div>

                @error('persian')
                    <p class="text-red-500 mt-3 text-sm">{{ $message }}</p>
                @enderror

                @if(session('success'))
                    <div class="mt-6 text-green-600 font-bold text-xl bg-white/80 rounded-xl py-4 px-8 inline-block">
                        {{ session('success') }}
                    </div>
                @endif
            </form>
        </div>

        <!-- لیست کلمات -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            @forelse($words as $word)
                <div class="card bg-white/95 backdrop-blur rounded-3xl p-8 shadow-xl border border-pink-100">
                    <h3 class="text-3xl font-bold text-center text-pink-600 mb-6">{{ $word->persian }}</h3>
                    
                    <div class="space-y-4">
                        <div class="flex items-center justify-between bg-sky-50 rounded-2xl px-5 py-4">
                            <span class="text-lg text-sky-700 font-medium">{{ $word->english }}</span>
                            <button onclick="speak('{{ $word->english }}', 'en-US')" 
                                    class="bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-xl shadow-lg">
                                🔊
                            </button>
                        </div>

                        <div class="flex items-center justify-between bg-pink-50 rounded-2xl px-5 py-4">
                            <span class="text-lg text-pink-700 font-medium">{{ $word->french }}</span>
                            <button onclick="speak('{{ $word->french }}', 'fr-FR')" 
                                    class="bg-pink-500 hover:bg-pink-600 text-white p-3 rounded-xl shadow-lg">
                                🔊
                            </button>
                        </div>
                    </div>
                    <form action="{{ route('words.destroy', $word) }}" method="POST" class="mt-4">
    @csrf
    @method('DELETE')
    <button type="submit" 
             class="bg-red-600 hover:bg-pink-600 w-full text-white p-2  rounded-xl shadow-lg">
                             
        حذف
    </button>
</form>

                </div>
            @empty
                <div class="col-span-full text-center py-20">
                    <p class="text-2xl text-pink-600">هنوز کلمه‌ای اضافه نکردی</p>
                    <p class="text-gray-500 mt-3">از بالا یک کلمه فارسی بنویس و ببین چطور ترجمه میشه!</p>
                </div>
            @endforelse
        </div>

        <div class="mt-12 text-center">
            {{ $words->links() }}
        </div>
    </div>
</x-app-layout>

<script>
function speak(text, lang) {
    if (!text || text.trim() === '') return;

    const apiKey = "ffbff23633434e6291d1f92a42925a6d"; 
    const voiceLang = lang === "fr-FR" ? "fr-fr" : "en-us";

    const url =
        "https://api.voicerss.org/?" +
        "key=" + apiKey +
        "&hl=" + voiceLang +
        "&src=" + encodeURIComponent(text) +
        "&r=0&c=mp3&f=44khz_16bit_stereo";

    const audio = new Audio(url);
    audio.play().catch(err => console.log("Audio blocked:", err));
}
</script>


</body>
</html>