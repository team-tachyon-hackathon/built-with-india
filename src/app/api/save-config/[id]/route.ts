// src/app/api/save-config/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid configuration ID' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Get the configuration by ID
    const config = await db.collection('cicd_configs').findOne({
      _id: new ObjectId(id)
    });
    
    if (!config) {
      return NextResponse.json(
        { error: 'Configuration not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ config });
  } catch (error: any) {
    console.error('Error retrieving CI/CD configuration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve configuration' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid configuration ID' },
        { status: 400 }
      );
    }
    
    // Connect to MongoDB
    const { db } = await connectToDatabase();
    
    // Delete the configuration by ID
    const result = await db.collection('cicd_configs').deleteOne({
      _id: new ObjectId(id)
    });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Configuration not found or already deleted' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      message: 'Configuration deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting CI/CD configuration:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete configuration' },
      { status: 500 }
    );
  }
}