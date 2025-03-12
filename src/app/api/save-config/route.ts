// src/app/api/save-config/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const { yaml, provider, projectName, savedAt } = await request.json();
    const userId = session.user.id;

    // Validation
    if (!yaml) {
      return NextResponse.json(
        { error: 'YAML configuration is required' },
        { status: 400 }
      );
    }

    if (!provider) {
      return NextResponse.json(
        { error: 'CI/CD provider type is required' },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Create a new document in the cicd_configs collection with user ID
    const result = await db.collection('cicd_configs').insertOne({
      userId,
      yaml,
      provider,
      projectName: projectName || 'Unknown Project',
      savedAt: savedAt || new Date().toISOString(),
      createdAt: new Date()
    });

    if (!result.acknowledged) {
      throw new Error('Failed to save configuration to database');
    }

    return NextResponse.json({
      message: 'Configuration saved successfully',
      id: result.insertedId
    });
  } catch (error: any) {
    console.error('Error saving CI/CD configuration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save configuration' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if the user is authenticated
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    const userId = session.user.id;
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get the latest 10 saved configurations for the current user
    const configs = await db.collection('cicd_configs')
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .toArray();

    return NextResponse.json({ configs });
  } catch (error: any) {
    console.error('Error retrieving CI/CD configurations:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve configurations' },
      { status: 500 }
    );
  }
}