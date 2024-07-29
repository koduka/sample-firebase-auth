'use client'

import { Button } from '@/libs/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/libs/components/ui/form'
import { Input } from '@/libs/components/ui/input'
import { cn } from '@/libs/utils'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email('メールアドレスを入力してください'),
  password: z
    .string({ required_error: 'パスワードを入力してください。' })
    .min(1, { message: 'パスワードを入力してください。' }),
})

type Props = {
  className?: string
  onSubmit: (value: z.infer<typeof formSchema>) => void
}

export function SignInForm({ className, onSubmit }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn('space-y-8', className)}>
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
        <Button type="submit" className="w-full">
          サインイン
        </Button>
      </form>
    </Form>
  )
}
