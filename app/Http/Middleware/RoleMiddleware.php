<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect('/login');
        }

        // Owner bebas akses semua halaman
        if (auth()->user()->role == 'owner') {
            return $next($request);
        }

        if (!in_array(auth()->user()->role, $roles)) {
            abort(403);
        }

        return $next($request);
    }
}