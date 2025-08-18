import { NextRequest } from 'next/server'

// Mock dependencies before importing
jest.mock('../../src/lib/auth', () => ({
  auth: jest.fn(),
}))

jest.mock('../../src/lib/prisma', () => ({
  prisma: {
    prompt: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    tag: {
      upsert: jest.fn(),
    },
    promptTag: {
      create: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}))

import { POST, GET } from '../../src/app/api/prompts/route'
import { auth } from '../../src/lib/auth'
import { prisma } from '../../src/lib/prisma'

const mockAuth = auth as jest.MockedFunction<typeof auth>
const mockPrisma = prisma as any

describe('/api/prompts', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Prompt',
          body: 'Test body',
          tags: ['test']
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return 422 when validation fails', async () => {
      mockAuth.mockResolvedValue({ user: { id: 'user1' } })

      const request = new NextRequest('http://localhost:3000/api/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: '', // Invalid: empty title
          body: 'Test body',
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)

      expect(response.status).toBe(422)
    })

    it('should create prompt successfully', async () => {
      const mockUser = { user: { id: 'user1' } }
      const mockPrompt = {
        id: 'prompt1',
        title: 'Test Prompt',
        body: 'Test body',
        userId: 'user1',
        createdAt: '2025-08-18T21:07:39.766Z',
        updatedAt: '2025-08-18T21:07:39.766Z',
      }

      mockAuth.mockResolvedValue(mockUser)
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        mockPrisma.prompt.create.mockResolvedValue(mockPrompt)
        return callback(mockPrisma)
      })

      const request = new NextRequest('http://localhost:3000/api/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Prompt',
          body: 'Test body',
          tags: []
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockPrompt)
      expect(mockPrisma.prompt.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Prompt',
          body: 'Test body',
          userId: 'user1'
        }
      })
    })

    it('should create prompt with tags successfully', async () => {
      const mockUser = { user: { id: 'user1' } }
      const mockPrompt = {
        id: 'prompt1',
        title: 'Test Prompt',
        body: 'Test body',
        userId: 'user1',
        createdAt: '2025-08-18T21:07:39.766Z',
        updatedAt: '2025-08-18T21:07:39.766Z',
      }
      const mockTag = { id: 'tag1', name: 'test', userId: 'user1' }

      mockAuth.mockResolvedValue(mockUser)
      mockPrisma.$transaction.mockImplementation(async (callback: any) => {
        mockPrisma.prompt.create.mockResolvedValue(mockPrompt)
        mockPrisma.tag.upsert.mockResolvedValue(mockTag)
        mockPrisma.promptTag.create.mockResolvedValue({ id: 'pt1' })
        return callback(mockPrisma)
      })

      const request = new NextRequest('http://localhost:3000/api/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Prompt',
          body: 'Test body',
          tags: ['test']
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data).toEqual(mockPrompt)
      expect(mockPrisma.tag.upsert).toHaveBeenCalledWith({
        where: { userId_name: { userId: 'user1', name: 'test' } },
        update: {},
        create: { userId: 'user1', name: 'test' }
      })
      expect(mockPrisma.promptTag.create).toHaveBeenCalledWith({
        data: { promptId: 'prompt1', tagId: 'tag1' }
      })
    })

    it('should handle database errors gracefully', async () => {
      const mockUser = { user: { id: 'user1' } }
      
      mockAuth.mockResolvedValue(mockUser)
      mockPrisma.$transaction.mockRejectedValue(new Error('Database error'))

      const request = new NextRequest('http://localhost:3000/api/prompts', {
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Prompt',
          body: 'Test body',
          tags: []
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data).toEqual({ error: 'Internal server error' })
    })
  })

  describe('GET', () => {
    it('should return 401 when user is not authenticated', async () => {
      mockAuth.mockResolvedValue(null)

      const request = new NextRequest('http://localhost:3000/api/prompts')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data).toEqual({ error: 'Unauthorized' })
    })

    it('should return prompts for authenticated user', async () => {
      const mockUser = { user: { id: 'user1' } }
      const mockPrompts = [
        {
          id: 'prompt1',
          title: 'Test Prompt',
          body: 'Test body',
          isFavorite: false,
          isArchived: false,
          updatedAt: '2025-08-18T21:07:39.798Z',
          tags: [{ tag: { name: 'test' } }]
        }
      ]

      mockAuth.mockResolvedValue(mockUser)
      mockPrisma.prompt.findMany.mockResolvedValue(mockPrompts)

      const request = new NextRequest('http://localhost:3000/api/prompts')

      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(Array.isArray(data)).toBe(true)
      expect(data[0]).toEqual({
        id: 'prompt1',
        title: 'Test Prompt',
        body: 'Test body',
        isFavorite: false,
        isArchived: false,
        updatedAt: '2025-08-18T21:07:39.798Z',
        tags: ['test']
      })
    })
  })
})
