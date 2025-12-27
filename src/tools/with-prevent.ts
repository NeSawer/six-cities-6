import { BaseSyntheticEvent } from 'react';

export default function withPrevent<TEvent extends BaseSyntheticEvent>(
  next: (e: TEvent) => unknown) {
  return (e: TEvent) => {
    e.preventDefault();
    return next(e);
  };
}
