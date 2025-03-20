import { Test, TestingModule } from '@nestjs/testing';
import { UniversitiesService } from '../universities.service';
import { UniversitiesRepository } from '../universities.repository';
import { NotFoundException } from '@nestjs/common';

describe('UniversitiesService', () => {
  let service: UniversitiesService;
  let repository: UniversitiesRepository;

  const mockUniversities = [
    {
      _id: '1',
      name: 'Harvard University',
      country: 'United States',
      alpha_two_code: 'US',
      domains: ['harvard.edu'],
      web_pages: ['https://www.harvard.edu/'],
      lastQuoteValue: 0,
      lastQuoteUpdate: new Date(),
    },
    {
      _id: '2',
      name: 'Oxford University',
      country: 'United Kingdom',
      alpha_two_code: 'GB',
      domains: ['ox.ac.uk'],
      web_pages: ['https://www.ox.ac.uk/'],
      lastQuoteValue: 0,
      lastQuoteUpdate: new Date(),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UniversitiesService,
        {
          provide: UniversitiesRepository,
          useValue: {
            findAll: jest.fn().mockResolvedValue(mockUniversities),
            findById: jest.fn().mockImplementation((id) => {
              const university = mockUniversities.find(u => u._id === id);
              return Promise.resolve(university);
            }),
            findByName: jest.fn().mockResolvedValue([mockUniversities[0]]),
            findByCountry: jest.fn().mockResolvedValue([mockUniversities[1]]),
            countAll: jest.fn().mockResolvedValue(mockUniversities.length),
            countByName: jest.fn().mockResolvedValue(1),
            countByCountry: jest.fn().mockResolvedValue(1),
            updateQuote: jest.fn().mockImplementation((id, value) => {
              const university = mockUniversities.find(u => u._id === id);
              if (university) {
                university.lastQuoteValue = value;
                university.lastQuoteUpdate = new Date();
              }
              return Promise.resolve(university);
            }),
            getLatestQuotes: jest.fn().mockResolvedValue([]),
            getUniversityQuote: jest.fn().mockImplementation((id) => {
              const university = mockUniversities.find(u => u._id === id);
              if (!university) return Promise.resolve(null);
              return Promise.resolve({
                value: university.lastQuoteValue,
                updatedAt: university.lastQuoteUpdate,
                universityName: university.name
              });
            }),
          },
        },
      ],
    }).compile();

    service = module.get<UniversitiesService>(UniversitiesService);
    repository = module.get<UniversitiesRepository>(UniversitiesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of universities with pagination', async () => {
      const result = await service.findAll();
      expect(result.data).toEqual(mockUniversities);
      expect(result.total).toEqual(mockUniversities.length);
      expect(result.page).toEqual(1);
      expect(result.limit).toEqual(20);
      expect(repository.findAll).toHaveBeenCalled();
      expect(repository.countAll).toHaveBeenCalled();
    });
  });

  describe('search', () => {
    it('should search by name', async () => {
      const result = await service.search({ name: 'Harvard' });
      expect(result.data).toEqual([mockUniversities[0]]);
      expect(result.total).toEqual(1);
      expect(repository.findByName).toHaveBeenCalledWith('Harvard', 1, 20);
      expect(repository.countByName).toHaveBeenCalledWith('Harvard');
    });

    it('should search by country', async () => {
      const result = await service.search({ country: 'United Kingdom' });
      expect(result.data).toEqual([mockUniversities[1]]);
      expect(result.total).toEqual(1);
      expect(repository.findByCountry).toHaveBeenCalledWith('United Kingdom', 1, 20);
      expect(repository.countByCountry).toHaveBeenCalledWith('United Kingdom');
    });

    it('should return all universities when no criteria is provided', async () => {
      const result = await service.search({});
      expect(result.data).toEqual(mockUniversities);
      expect(result.total).toEqual(mockUniversities.length);
      expect(repository.findAll).toHaveBeenCalled();
      expect(repository.countAll).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a university by ID', async () => {
      const result = await service.findById('1');
      expect(result).toEqual(mockUniversities[0]);
      expect(repository.findById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFound when university doesnt exist', async () => {
      await expect(service.findById('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateQuote', () => {
    it('should update a university quote', async () => {
      const result = await service.updateQuote('1', 123.45);
      expect(result.lastQuoteValue).toEqual(123.45);
      expect(repository.updateQuote).toHaveBeenCalledWith('1', 123.45);
    });

    it('should throw NotFound when university doesnt exist', async () => {
      await expect(service.updateQuote('999', 123.45)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUniversityQuote', () => {
    it('should get a university quote', async () => {
      const result = await service.getUniversityQuote('1');
      expect(result.universityName).toEqual(mockUniversities[0].name);
    });

    it('should throw NotFound when quote doesnt exist', async () => {
      await expect(service.getUniversityQuote('999')).rejects.toThrow(NotFoundException);
    });
  });
});
