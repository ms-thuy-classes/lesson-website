import { ArticlesData, LessonData } from '../types';

// Fallback direct bundled data in case fetch is blocked by preview iframe sandbox or strict origin policies
import articlesOverviewData from '../../public/data/articles.json';
import unit1Data from '../../public/data/lessons/unit-1-life-stories.json';
import unit2Data from '../../public/data/lessons/unit-2-education.json';
import unit3Data from '../../public/data/lessons/unit-3-community-service.json';
import unit4Data from '../../public/data/lessons/unit-4-technology.json';
import unit5Data from '../../public/data/lessons/unit-5-environment.json';
import unit6Data from '../../public/data/lessons/unit-6-travel-culture.json';
import unit7Data from '../../public/data/lessons/unit-7-healthy-living.json';
import unit8Data from '../../public/data/lessons/unit-8-future-careers.json';
import unit9Data from '../../public/data/lessons/unit-9-family-relationships.json';
import unit10Data from '../../public/data/lessons/unit-10-media-communication.json';
import ieltsData from '../../public/data/lessons/ielts-vocab-band7.json';
import toeicData from '../../public/data/lessons/toeic-business-communication.json';

const bundledLessons: Record<string, LessonData> = {
  'unit-1-life-stories': unit1Data as LessonData,
  'unit-2-education': unit2Data as LessonData,
  'unit-3-community-service': unit3Data as LessonData,
  'unit-4-technology': unit4Data as LessonData,
  'unit-5-environment': unit5Data as LessonData,
  'unit-6-travel-culture': unit6Data as LessonData,
  'unit-7-healthy-living': unit7Data as LessonData,
  'unit-8-future-careers': unit8Data as LessonData,
  'unit-9-family-relationships': unit9Data as LessonData,
  'unit-10-media-communication': unit10Data as LessonData,
  'ielts-vocab-band7': ieltsData as LessonData,
  'toeic-business-communication': toeicData as LessonData,
};

export async function fetchArticles(): Promise<ArticlesData> {
  try {
    const response = await fetch('/data/articles.json');
    if (response.ok) {
      const data = await response.json();
      return data as ArticlesData;
    }
  } catch (err) {
    console.warn('Falling back to bundled articles data:', err);
  }
  return articlesOverviewData as ArticlesData;
}

export async function fetchLessonById(id: string): Promise<LessonData | null> {
  try {
    const response = await fetch(`/data/lessons/${id}.json`);
    if (response.ok) {
      const data = await response.json();
      return data as LessonData;
    }
  } catch (err) {
    console.warn(`Falling back to bundled lesson data for ${id}:`, err);
  }

  if (bundledLessons[id]) {
    return bundledLessons[id];
  }

  return null;
}
