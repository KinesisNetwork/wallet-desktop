import { OurEpic } from '@store'
import { ignoreElements, tap } from 'rxjs/operators'

export const logging$: OurEpic = (action$) =>
  action$.pipe(
  // tslint:disable-next-line:no-console
    tap((action) => console.log('Action received:', action)),
    ignoreElements(),
  )
