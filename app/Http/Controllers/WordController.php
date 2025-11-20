<?php

namespace App\Http\Controllers;

use App\Models\Word;
use Illuminate\Http\Request;
use Stichoza\GoogleTranslate\GoogleTranslate;
use Illuminate\Support\Facades\Auth;

class WordController extends Controller
{


    public function index()
    {
        $words = Auth::user()->words()->latest()->paginate(12);

        return view('words.index', compact('words'));
    }
public function destroy(Word $word)
{
    if ($word->user_id !== auth()->id()) {
        abort(403, 'Unauthorized action.');
    }

    $word->delete();

    return back()->with('success', "کلمه با موفقیت حذف شد!");
}
    public function store(Request $request)
    {
        $request->validate([
            'persian' => [
                'required',
                'string',
                'max:100',
                function ($attribute, $value, $fail) {
                    if (Auth::user()->words()->where('persian', $value)->exists()) {
                        $fail('«' . $value . '» قبلاً به لغت‌نامه‌ات اضافه شده!');
                    }
                },
            ],
        ]);

        $persian = trim($request->persian);

        try {
            $tr = new GoogleTranslate();
            $tr->setSource('fa');
            $english = $tr->setTarget('en')->translate($persian) ?: $persian;
            $french  = $tr->setTarget('fr')->translate($persian) ?: $persian;
        } catch (\Exception $e) {
            $english = $persian;
            $french  = $persian;
        }

        Auth::user()->words()->create([
            'persian' => $persian,
            'english' => $english,
            'french'  => $french,
        ]);

        return back()->with('success', "«{$persian}» با موفقیت اضافه شد!");
    }
}