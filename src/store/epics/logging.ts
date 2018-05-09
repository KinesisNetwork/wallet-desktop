import { Epic } from '@store';
import { tap, ignoreElements, } from 'rxjs/operators';

export const logging$: Epic = (action$) => action$.pipe(tap((action) => console.log('Action received:', action)), ignoreElements())
