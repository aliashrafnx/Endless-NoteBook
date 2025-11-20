<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WordController;

Route::middleware(['auth'])->group(function () {
    Route::get('/', [WordController::class, 'index'])->name('home');
    Route::post('/words', [WordController::class, 'store'])->name('words.store');
    Route::get('/words', [WordController::class, 'index']);
    Route::delete('/words/{word}', [WordController::class, 'destroy'])->name('words.destroy')->middleware('auth');

});

Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
