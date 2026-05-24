<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'title',
        'content',
        'summary',
    ];

    /**
     * Get the student user who owns the study note.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}