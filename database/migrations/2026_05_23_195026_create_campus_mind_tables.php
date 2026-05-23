<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // 1. Notes & Summaries Table
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->text('summary')->nullable();
            $table->timestamps();
        });

        // 2. Quizzes Table
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('topic');
            $table->string('difficulty')->default('Medium');
            $table->json('generated_questions'); // Stores structured MCQs
            $table->timestamps();
        });

        // 3. Study Tasks/Planner Table
        Schema::create('tasks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('task_title');
            $table->dateTime('deadline');
            $table->string('status')->default('Pending'); // Pending, Completed
            $table->timestamps();
        });

        // 4. AI Interaction Logs Table
        Schema::create('ai_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('prompt');
            $table->text('response');
            $table->string('feature_type'); // Chat, Summarizer, Quiz
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_logs');
        Schema::dropIfExists('tasks');
        Schema::dropIfExists('quizzes');
        Schema::dropIfExists('notes');
    }
};