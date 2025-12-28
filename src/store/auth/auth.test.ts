import { AuthorizationStatus } from '../../models/authorization-status';
import { makeFakeUser } from '../../test-utils/mock';
import { authSlice, setAuthStatus, setCurrentUser } from './auth';

describe('Auth Slice', () => {
  it('should return initial state with empty action', () => {
    const emptyAction = { type: '' };
    const expectedState = { authStatus: AuthorizationStatus.Auth, currentUser: null };

    const result = authSlice.reducer(expectedState, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should return default initial state with empty action and undefined state', () => {
    const emptyAction = { type: '' };
    const expectedState = { authStatus: AuthorizationStatus.Unknown, currentUser: null };

    const result = authSlice.reducer(undefined, emptyAction);

    expect(result).toEqual(expectedState);
  });

  it('should set auth status with "setAuthStatus" action', () => {
    const initialState = { authStatus: AuthorizationStatus.Unknown, currentUser: null };
    const expectedState = { authStatus: AuthorizationStatus.Auth, currentUser: null };

    const result = authSlice.reducer(initialState, setAuthStatus(AuthorizationStatus.Auth));

    expect(result).toEqual(expectedState);
  });

  it('should set current user with "setCurrentUser" action', () => {
    const initialState = { authStatus: AuthorizationStatus.Unknown, currentUser: null };
    const expectedState = { authStatus: AuthorizationStatus.Unknown, currentUser: makeFakeUser() };

    const result = authSlice.reducer(initialState, setCurrentUser(expectedState.currentUser));

    expect(result).toEqual(expectedState);
  });
});
