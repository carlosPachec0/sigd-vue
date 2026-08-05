# academy.dto.ts (example)

Target path: `src/modules/{domain}/types/{resource}.dto.ts`

Reference DTO shapes (`{Resource}Dto`, `Create{Resource}Dto`,
`Update{Resource}Dto`).

```ts
export interface AcademyDto {
  id: number
  name: string
  address: string
  createdAt: string
}

export type CreateAcademyDto = Omit<AcademyDto, 'id' | 'createdAt'>

export type UpdateAcademyDto = Partial<CreateAcademyDto>
```