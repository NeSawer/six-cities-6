import { vi, describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useAsyncEffect from './use-async-effect';

describe('useAsyncEffect', () => {
  it('calls the effect function on mount with an AbortSignal', () => {
    const effect = vi.fn();

    renderHook(() => useAsyncEffect(effect, []));

    expect(effect).toHaveBeenCalledTimes(1);
    const signal = effect.mock.calls[0][0] as AbortSignal;
    expect(signal).toBeDefined();
    expect(signal.aborted).toBe(false);
  });

  it('aborts the controller on unmount', () => {
    let capturedSignal: AbortSignal | null = null;
    const effect = (signal: AbortSignal) => {
      capturedSignal = signal;
    };

    const { unmount } = renderHook(() => useAsyncEffect(effect, []));

    expect(capturedSignal).not.toBeNull();
    expect(capturedSignal!.aborted).toBe(false);

    unmount();

    expect(capturedSignal!.aborted).toBe(true);
  });

  it('re-runs the effect when dependencies change', () => {
    const effect = vi.fn();
    let dep = 0;

    const { rerender } = renderHook(() =>
      useAsyncEffect(effect, [dep])
    );

    expect(effect).toHaveBeenCalledTimes(1);

    dep = 1;
    rerender();

    expect(effect).toHaveBeenCalledTimes(2);
  });

  it('aborts previous effect when dependencies change', () => {
    const signals: AbortSignal[] = [];
    const effect = (signal: AbortSignal) => {
      signals.push(signal);
    };

    let dep = 0;
    const { rerender } = renderHook(() =>
      useAsyncEffect(effect, [dep])
    );
    dep = 1;
    rerender();

    expect(signals[0].aborted).toBe(true);
    expect(signals[1].aborted).toBe(false);
  });
});
