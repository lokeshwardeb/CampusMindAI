<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Task extends Model
{
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'task_title',
        'deadline',
        'status',
    ];

    /**
     * The attributes that should be cast to native dates or Carbon types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'deadline' => 'datetime',
    ];

    /**
     * Get the student user who managed this specific task schedule block.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}