<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AiLog extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'ai_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'user_id',
        'prompt',
        'response',
        'feature_type',
    ];

    /**
     * Get the student user who triggered the log event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}