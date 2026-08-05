# academy.service.ts (example)

Target path: `src/modules/{domain}/services/{resource}.service.ts`

Reference service implementation. Duplicate per resource, renaming
`Academy`/`academy` to the actual resource. Owns the endpoint path — nothing
outside this class knows it.

```ts
import { BaseHttpService } from '@/shared/api/base-http-service'
import type { AcademyDto, CreateAcademyDto, UpdateAcademyDto } from '../types/academy.dto'

/**
 * Owns everything about the /academies endpoint: URL, HTTP verb per
 * operation, and request/response typing. Nothing outside this class
 * knows the resource path.
 */
class AcademyService extends BaseHttpService {
  private readonly resource = '/academies'

  getAll(): Promise<AcademyDto[]> {
    return this.get<AcademyDto[]>(this.resource)
  }

  getById(id: number): Promise<AcademyDto> {
    return this.get<AcademyDto>(`${this.resource}/${id}`)
  }

  create(payload: CreateAcademyDto): Promise<AcademyDto> {
    return this.post<AcademyDto, CreateAcademyDto>(this.resource, payload)
  }

  update(id: number, payload: UpdateAcademyDto): Promise<AcademyDto> {
    return this.patch<AcademyDto, UpdateAcademyDto>(`${this.resource}/${id}`, payload)
  }

  remove(id: number): Promise<void> {
    return this.delete<void>(`${this.resource}/${id}`)
  }
}

// Exported as a singleton instance — stores import this, never the class.
export const academyService = new AcademyService()
```