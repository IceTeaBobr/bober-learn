"use server";

import { auth } from "@/lib/auth/server";
import { sql } from "@/lib/db";

export type Todo = {
  id: number;
  text: string;
  done: boolean;
  date: string | null;
};

// Get the logged-in user's id, or throw if not authenticated.
async function requireUserId(): Promise<string> {
  const { data: session } = await auth.getSession();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// All todos belonging to the current user.
export async function getTodos(): Promise<Todo[]> {
  const userId = await requireUserId();
  const rows = await sql`
    SELECT id, text, done, date
    FROM todos
    WHERE user_id = ${userId}
    ORDER BY created_at ASC, id ASC
  `;
  return rows.map((r) => ({
    id: Number(r.id),
    text: r.text as string,
    done: r.done as boolean,
    date: (r.date as string | null) ?? null,
  }));
}

// Add a todo for the current user, returns the created row.
export async function addTodo(text: string, date: string): Promise<Todo> {
  const userId = await requireUserId();
  const clean = text.trim();
  if (clean === "") throw new Error("Empty task");
  const rows = await sql`
    INSERT INTO todos (user_id, text, date)
    VALUES (${userId}, ${clean}, ${date || null})
    RETURNING id, text, done, date
  `;
  const r = rows[0];
  return {
    id: Number(r.id),
    text: r.text as string,
    done: r.done as boolean,
    date: (r.date as string | null) ?? null,
  };
}

// Set a todo's done state (only if it belongs to the current user).
export async function toggleTodo(id: number, done: boolean): Promise<void> {
  const userId = await requireUserId();
  await sql`
    UPDATE todos SET done = ${done}
    WHERE id = ${id} AND user_id = ${userId}
  `;
}

// Delete a todo (only if it belongs to the current user).
export async function deleteTodo(id: number): Promise<void> {
  const userId = await requireUserId();
  await sql`
    DELETE FROM todos
    WHERE id = ${id} AND user_id = ${userId}
  `;
}
