import { api } from '@airtasker/spot'

import './endpoints/auth'
import './endpoints/users'
import './endpoints/students'
import './endpoints/programs'

@api({ name: 'TaiGer Portal API' })
class Api {}
