'use client'

import { Button } from '@/libs/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/libs/components/ui/form'
import { Input } from '@/libs/components/ui/input'
// import { signUpFormSchema } from '@/libs/forms/sign-up/schema'
import { cn } from '@/libs/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

type Props = {
  className?: string
  onSubmit: (value: z.infer<typeof signUpFormSchema>) => void
}

const signUpFormSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスを入力してください。' })
    .min(1, { message: 'メールアドレスを入力してください。' })
    .email('無効なメールアドレスの形式です。正しいメールアドレスを入力してください。'),
  password: z
    .string({ required_error: 'パスワードを入力してください。' })
    .min(1, { message: 'パスワードを入力してください。' })
    .min(8, { message: 'パスワードを8文字以上にしてください。' })
    .regex(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])/, {
      message: 'パスワードは数字・英小文字・英大文字をそれぞれ1文字以上使用してください',
    }),
  name: z.string().min(1, { message: '名前を入力してください。' }),
  homeAddress: z.string(),
})

export function SignUpForm({ className, onSubmit }: Props) {
  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      homeAddress: '',
    },
  })

  // const [state, dispach] = useFormState<State, FormData>((prev: State, payload: FormData) => signUp(payload), {
  //   isSuccess: false,
  // })

  // useEffect(() => {
  //   if (state.isSuccess) {
  //     const { email, password } = form.getValues()
  //     signIn(email, password)
  //   } else if (!state.isSuccess && state.message) {
  //     toast.error(state.message)
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [state])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-8', className)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>名前</FormLabel>
              <FormControl>
                <Input autoComplete="account-name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>メールアドレス</FormLabel>
              <FormControl>
                <Input autoComplete="account-email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>パスワード</FormLabel>
              <FormControl>
                <Input autoComplete="off" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="homeAddress"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>住所</FormLabel>
              <FormControl>
                <Input autoComplete="account-home-address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          サインアップ
        </Button>
      </form>
    </Form>
  )
}
