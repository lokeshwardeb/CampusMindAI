<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Flashcard extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'question',
        'answer',
        'deck_name',
    ];

    // protected $fillable = ['user_id', 'question', 'answer', 'deck_name'];

    /**
     * Get the student user who owns the flashcard deck.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}