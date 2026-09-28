<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'alamat' => 'nullable|string|max:255',
            'no_hp' => 'nullable|string|max:20',
            'email' => 'required|email|max:255|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'alamat' => $validated['alamat'] ?? null,
            'no_hp' => $validated['no_hp'] ?? null,
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => 'pelanggan',
        ]);

        $token = $user->createToken('brandforge-api')->plainTextToken;

        return response()->json([
            'message' => 'Registrasi berhasil',
            'token' => $token,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'alamat' => $user->alamat,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ], 201);
    }

    public function login(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (!$user || !Hash::check($validated['password'], $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        $token = $user->createToken('brandforge-api')->plainTextToken;

        return response()->json([
            'message' => 'Login berhasil',
            'token' => $token,
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'alamat' => $user->alamat,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }

    public function user(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'alamat' => $user->alamat,
                'no_hp' => $user->no_hp,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }
}