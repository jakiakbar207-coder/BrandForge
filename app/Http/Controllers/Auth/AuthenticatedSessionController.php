<?php

    namespace App\Http\Controllers\Auth;

    use App\Http\Controllers\Controller;
    use App\Http\Requests\Auth\LoginRequest;
    use Illuminate\Http\RedirectResponse;
    use Illuminate\Http\Request;
    use Illuminate\Support\Facades\Auth;
    use Illuminate\View\View;

    class AuthenticatedSessionController extends Controller
    {
        /**
         * Display the login view.exit
         */
        public function create(Request $request): View
    {
        return view('auth.login', [
            'role' => $request->role,
        ]);
    }

        /**
         * Handle an incoming authentication request.
         */
        public function store(LoginRequest $request): RedirectResponse
        {
            $request->authenticate();

            $request->session()->regenerate();

        // Cek apakah role sesuai dengan halaman login
        if ($request->filled('role') && auth()->user()->role != $request->role) {

            Auth::logout();

            return back()->withErrors([
                'email' => 'Anda tidak dapat login melalui halaman ini.'
            ]);
        }

            if (auth()->user()->role == 'owner') {
                return redirect('/owner');
            }

            if (auth()->user()->role == 'admin') {
                return redirect('/admin');
            }

            if (auth()->user()->role == 'kasir') {
                return redirect('/kasir');
            }

            if (auth()->user()->role == 'pelanggan') {
                return redirect('/pelanggan');
            }

            return redirect('/dashboard');
        }

        /**
         * Destroy an authenticated session.
         */
        public function destroy(Request $request): RedirectResponse
        {
            Auth::guard('web')->logout();

            $request->session()->invalidate();

            $request->session()->regenerateToken();

            return redirect('/');
        }
    }