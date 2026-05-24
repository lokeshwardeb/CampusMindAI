<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quiz extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'topic',
        'difficulty',
        'generated_questions',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'generated_questions' => 'array', // Automatically handles database JSON conversions
    ];

    /**
     * Get the student user who generated the quiz workspace.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}