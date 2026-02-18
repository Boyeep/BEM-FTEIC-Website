nama website di package.json untuk sementara aku bikin "bem-fteic-front-end"

next-sitemap.config.js perlu diubah

.env.example perlu diubah

- what have i done:

- bikin project folder front-end:

1. created /app/(auth)/check-inbox/page.tsx
2. created /app/(auth)/confirm-email/page.tsx
3. created /app/(auth)/login/page.tsx
4. created /app/(auth)/signup/page.tsx
5. created /app/(auth)/layout.tsx

6. created /src/components/input/Input.tsx

7. created /features/auth/components/CheckInboxCard.tsx
8. created /features/auth/components/EmailConfirmCard.tsx
9. created /features/auth/components/LoginForm.tsx
10. created /features/auth/components/SignupForm.tsx

11. created /features/auth/hooks/useLoginMutation.ts
12. created /features/auth/hooks/useSignupMutation.ts
13. created /features/auth/hooks/useVerifyEmail.ts

14. created /features/auth/services/authService.ts
15. created /features/auth/store/useAuthStore.ts
16. created /features/auth/types.ts

17. created /public/robots.txt
18. created /public/sitemap-0.xml
19. created /public/sitemap.xml
# katanya ini 3 untuk SEO idk bruh

# Notes: Disetiap file baru ada comment diatas for context

- untuk run folder:

1. pnpm install
2. pnpm dev

- to check for changes (setelah run pnpm dev):

1. http://localhost:3000/login
2. http://localhost:3000/signup
3. http://localhost:3000/confirm-email
4. http://localhost:3000/check-inbox

- what you should done:

1. Bikin homepage
2. intergrate backend dan front-end

- Boy 